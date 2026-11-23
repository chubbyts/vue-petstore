import type { MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { listPetsClient } from '../client/pet';
import type { HttpError } from '../client/error';
import type { PetListResponse } from '../model/pet';
import { provideListQueryFn } from './use-query';

const petCountRequest = { offset: 0, limit: 1 };

// a single item is enough to get the count and the collection links (e.g. create)
export const usePetCountQuery = (enabled: MaybeRefOrGetter<boolean> = true) =>
  useQuery<PetListResponse, HttpError>({
    queryKey: ['pets', 'count'],
    queryFn: provideListQueryFn(listPetsClient, petCountRequest),
    enabled,
    retry: false,
  });
