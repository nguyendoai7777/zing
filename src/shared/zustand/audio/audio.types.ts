import type { Song } from '@typing';

export type UnionLoop = 0 | 1 | 2;

export interface AudioState {
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  songList: Song[]; // Kho 150-300 bài gốc tải về từ API
  currentList: Song[]; // Danh sách bài hát đang phát thực tế dạng Object đầy đủ

  // --- States  Persist xuống
  currentSong: Song | null; // Lưu thẳng nguyên Object bài hiện tại để hiển thị UI tức thì khi F5
  queueIds: number[]; // Chỉ lưu mảng ID của danh sách chờ để tối ưu dung lượng
  volume: number; // Thang âm lượng từ 0 - 100
  isMute: boolean; // Trạng thái tắt tiếng
  cacheVolume: number; // Lưu mức âm lượng trước khi Mute để khôi phục lại
  loop: UnionLoop; // 0: Không lặp, 1: Lặp 1 bài, 2: Lặp toàn bộ list
  shuffle: boolean; // Trạng thái trộn bài

  // --- Actions Hệ thống ---
  initEngine(): void;

  setSongsData(songs: Song[]): void;

  syncQueue(): void;

  togglePlaying(): void;

  playThisSong(song: Song, list?: Song[]): void;

  onNext(): void;

  onPrev(): void;

  seekTo(time: number): void;

  setVolume(vol: number): void;

  toggleMute(): void;

  toggleLoop(): void;

  toggleShuffle(): void;

  setupAudioListeners(): void;

  removeSongFromQueue(song: Song): void;
}
