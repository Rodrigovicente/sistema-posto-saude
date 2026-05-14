'use server';

import { db } from '@/db/connection';
import { groups, streets, addressIntervals } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Interval } from '../types/interval';

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
) {
  await db.insert(addressIntervals).values({
    groupId,
    streetId,
    startNumber,
    endNumber,
    parity,
  });
}

export async function deleteInterval(id: number) {
  await db.delete(addressIntervals).where(eq(addressIntervals.id, id));
}
