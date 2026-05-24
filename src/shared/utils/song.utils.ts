import type { Song } from '@typing';

export const songFromUrl = (song: Song) => encodeURI(`https://pub-9243b53a21cb49b09b66fc63f662221a.r2.dev/${song.url}`);
