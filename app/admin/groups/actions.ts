'use server';

import { db } from '@/db/connection';
import { groups, streets, addressIntervals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Interval, Parity } from '../../types/interval';
import { Response, SearchResult } from '../../types/action-response';
import { ptBrDictionary } from '@/lib/dictionary';
import { ilike } from '@/lib/utils';

export async function getGroups() {
  const loaded = await db.select().from(groups).orderBy(groups.name);
  return loaded;
}

export async function getStreets() {
  const loaded = await db.select().from(streets).orderBy(streets.name);
  return loaded;
}

export async function createGroup(name: string) {
  if (!name.trim()) return { error: 'Name is required' };
  await db.insert(groups).values({ name: name.trim() });
  return { success: true };
}

export async function getIntervals(groupId: number) {
  const res = await db
    .select({
      id: addressIntervals.id,
      name: streets.name,
      startNumber: addressIntervals.startNumber,
      endNumber: addressIntervals.endNumber,
      parity: addressIntervals.parity,
    })
    .from(addressIntervals)
    .innerJoin(streets, eq(addressIntervals.streetId, streets.id))
    .where(eq(addressIntervals.groupId, groupId));

  return res as Interval[];
}

export async function addInterval(
  groupId: number,
  streetId: number,
  startNumber: number,
  endNumber: number,
  parity: 'odd' | 'even' | 'both'
): Promise<Response> {
  if (startNumber > endNumber) {
    throw new Error('Start number must be less than or equal to end number');
  }

  const startEven = startNumber % 2 === 0;
  const endEven = endNumber % 2 === 0;

  if (parity === 'even' && (!startEven || !endEven)) {
    throw new Error('Parity and numbers are incompatible: even parity requires both start and end to be even');
  }

  if (parity === 'odd' && (startEven || endEven)) {
    throw new Error('Parity and numbers are incompatible: odd parity requires both start and end to be odd');
  }

  const existingIntervals = await db
    .select({
      id: addressIntervals.id,
      streetId: addressIntervals.streetId,
      startNumber: addressIntervals.startNumber,
      endNumber: addressIntervals.endNumber,
      groupId: addressIntervals.groupId,
      parity: addressIntervals.parity,
    })
    .from(addressIntervals)
    .where(eq(addressIntervals.streetId, streetId));

  const overlapping = existingIntervals.find(
    (interval) => interval.startNumber <= endNumber && interval.endNumber >= startNumber && (parity === 'both' || interval.parity == parity)
  );

  if (overlapping) {
    return {
      success: false,
      error: `${ptBrDictionary["Interval overlaps with an existing interval on this street"]} (${overlapping.startNumber}–${overlapping.endNumber}) ${ptBrDictionary["in group"]} ${overlapping.groupId}`,
    }
  }

  await db.insert(addressIntervals).values({
    groupId,
    streetId,
    startNumber,
    endNumber,
    parity,
  });

  return {
    success: true
  }
}

export async function searchAddress(streetName: string, houseNumber: number): Promise<Response<SearchResult>> {
  const street = await db.select().from(streets).where(ilike(streets.name, `%${streetName.trim()}%`)).limit(1);

  console.log('>>>', street);
  if (!street || street.length === 0) {
    return { success: false, error: `Street "${streetName}" not found` };
  }

  const streetId = street[0].id;

  const intervals = await db
    .select({
      id: addressIntervals.id,
      startNumber: addressIntervals.startNumber,
      endNumber: addressIntervals.endNumber,
      parity: addressIntervals.parity,
      groupId: addressIntervals.groupId,
      groupName: groups.name,
      streetName: streets.name,
    })
    .from(addressIntervals)
    .innerJoin(streets, eq(addressIntervals.streetId, streets.id))
    .innerJoin(groups, eq(addressIntervals.groupId, groups.id))
    .where(eq(addressIntervals.streetId, streetId));

  const matchingInterval = intervals.find(
    (interval) => houseNumber >= interval.startNumber && houseNumber <= interval.endNumber
  );

  if (!matchingInterval) {
    return { success: false, error: `House number ${houseNumber} is not within any interval on street "${streetName}"` };
  }

  return {
    success: true,
    payload: {
      group: {
        id: matchingInterval.groupId,
        name: matchingInterval.groupName,
      },
      interval: {
        startNumber: matchingInterval.startNumber,
        endNumber: matchingInterval.endNumber,
        parity: matchingInterval.parity as Parity,
      },
      street: {
        name: matchingInterval.streetName
      }
    },
  };
}

export async function deleteInterval(id: number) {
  await db.delete(addressIntervals).where(eq(addressIntervals.id, id));
}
