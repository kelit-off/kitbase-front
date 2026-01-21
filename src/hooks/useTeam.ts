// hooks/useTeam.ts
"use client"

import { Team, teamApi } from '@/libs/api/team.api';
import { useQuery } from '@tanstack/react-query';

interface UseTeamOptions {
  enabled?: boolean;
}

/**
 * Hook pour récupérer :
 * - un team spécifique (teamSlug fourni)
 * - ou tous les teams (teamSlug non fourni)
 */
export function useTeam(teamSlug: string, options?: UseTeamOptions) {
  return useQuery<Team>({
    queryKey: ['teams', teamSlug],
    queryFn: () => teamApi.get(teamSlug),
    enabled: !!teamSlug && (options?.enabled ?? true),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useTeams(options?: UseTeamOptions) {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: () => teamApi.list(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

