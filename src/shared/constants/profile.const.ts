import { ArtisBaseInfo, ArtisProfile } from '@models/artist.model';
import { uuid } from '@modules/feature.module';
import { Mp3 } from '@constants/urls.constant';
import { TOP_100_ALL } from '@constants/mock.const';

export const PROFILES: ArtisProfile[] = [
  {
    id: 'phao',
    name: 'Pháo',
    birthdate: '28 tháng 3, 2003 (19 tuổi)',
    nativePlace: 'Tuyên Quang',
    realName: 'Nguyễn Diệu Huyền',
    profileUrl: '/profile/Pháo',
    description: 'Là nữ rapper, ca sĩ thuộc tổ đội GVA, có khả năng rap và hát tốt cùng lúc, nổi bật với các ca khúc như "Hai Phút Hơn", "Vietnamese Girl"',
    artwork: 'https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/08/17/0/6/7/1/1597655440804_600.jpg',
    subArtwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/5/e/5/9/5e59302e5881708cb601c335894fbfe5.jpg',
    songs: [
      {
        id: 'dis12standout12list1',
        url: '/media/dieu-toa',
        mainArtist: {
          id: '13213213213',
          name: 'Pháo',
          profileUrl: '/profile/Pháo'
        },
        artwork: 'https://i1.sndcdn.com/artworks-FZScX6URzWnyTa1Z-z8MRtA-t500x500.jpg',
        mediaUrl: 'https://vnno-vn-5-tf-mp3-s1-m-zmp3.zmdcdn.me/d5ceaad8a89841c61889/3616294718705515402?authen=exp=1667556164~acl=/d5ceaad8a89841c61889/*~hmac=a7c524cb35515eb44ae75a456977f1b5',
        songName: 'Điêu Toa',
        songDuration: 311,
        listenTimes: '195.2k',
        subArtist: [
          {
            id: 'dhs23s2asd4',
            name: 'Nhí',
            profileUrl: '/profile/Nhí'
          },
          {
            id: 'dhs23s2asd412',
            name: 'Timon',
            profileUrl: '/profile/Timon'
          }
        ]
      },
      {
        id: 'dis12standout12lis21',
        url: '/media/dieu-toa',
        mainArtist: {
          id: 'phao',
          name: 'Pháo',
          profileUrl: '/profile/Pháo'
        },
        artwork: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/b/b/3/4/bb34cb705c8c6256b269428f0b867335.jpg',
        mediaUrl: 'https://vnno-vn-5-tf-mp3-s1-m-zmp3.zmdcdn.me/d5ceaad8a89841c61889/3616294718705515402?authen=exp=1666774524~acl=/d5ceaad8a89841c61889/*~hmac=4a2b57ae108a7ac740cefb475ecb2fdc',
        songName: 'Đần Độ',
        songDuration: 311,
        listenTimes: '195.2k',
        subArtist: [
          {
            id: 'masew',
            name: 'Masew',
            profileUrl: '/profile/Masew'
          },

        ]
      },
      {
        id: 'dis12standout12list2',
        url: '/media/noi-doi',
        mainArtist: {
          id: 'phao',
          name: 'Pháo',
          profileUrl: '/profile/Pháo'
        },
        artwork: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_webp/cover/5/2/2/b/522b5e7ea9a5c47d81d2bff3c52b899f.jpg',
        mediaUrl: 'https://vnno-pt-4-tf-mp3-320s1-m-zmp3.zmdcdn.me/e6a30f6677279e79c736/4073465265099019183?authen=exp=1667549311~acl=/e6a30f6677279e79c736/*~hmac=5274cc5cc7740593898022916cd95855',
        songName: 'Nói Dối',
        songDuration: 311,
        listenTimes: '195.2k',
        subArtist: [
          {
            id: 'hieu2',
            name: 'HIEUTHU2',
            profileUrl: '/profile/HIEUTHU2'
          },

        ]
      },
    ]
  },
  {
    id: 'lequyen',
    name: 'Lệ-Quyên',
    birthdate: '02/04/1981',
    nativePlace: 'Hà Nội',
    realName: ' Vũ Lệ Quyên',
    profileUrl: '/profile/Lệ-Quyên',
    description: 'Là ca sĩ dòng nhạc nhẹ của Việt Nam. Từ khi còn là sinh viên khoa Quần Chúng - Đại học Văn hóa (Hà Nội) Lệ Quyên đã bắt đầu bước vào con đường ca hát . Tuy nhiên, sự nghiệp ca hát chuyên nghiệp của cô chỉ bắt đầu từ năm 2002 khi được chọn tham gia hát bài hát của nhà tài trợ cho SEA Games 22 tại Việt Nam. Năm 2005, Lệ Quyên cho ra mắt khán giả album đầu tay, Giấc mơ có thật, album đã đưa tên tuổi của Lệ Quyên đến với khán',
    artwork: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_webp/cover/b/7/1/4/b714f0e447b3ec8c9f903c4963e52422.jpg',
    subArtwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/5/e/5/9/5e59302e5881708cb601c335894fbfe5.jpg',
    songs: [
      TOP_100_ALL[0],
      {
        id: Mp3.DeNho1ThoiTaDaYeu.id,
        url: '/media/die-nho-1-thoi-ta-da-yeu',
        mainArtist: {
          id: '13213213213',
          name: 'Lệ-Quyên',
          profileUrl: '/profile/Lệ-Quyên'
        },
        artwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/covers/0/7/07c1bec1955a6d2c4b0ce8f651885d77_1305855806.jpg',
        mediaUrl: Mp3.DeNho1ThoiTaDaYeu.url,
        songName: 'Để Nhớ Một Thời Ta Đã Yêu',
        songDuration: 280,
        listenTimes: '195.2k',
        subArtist: []
      },
      {
        id: Mp3.ViEmConThuong.id,
        url: '/media/vi-em-con-thuong',
        mainArtist: {
          id: 'lquyen',
          name: 'Lệ-Quyên',
          profileUrl: '/profile/Lệ-Quyên'
        },
        artwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/9/e/4/c/9e4c1683182e0a4c7394835da9c953a6.jpg',
        mediaUrl: Mp3.ViEmConThuong.url,
        songName: 'Vì Em Còn Thương',
        songDuration: 281,
        listenTimes: '195.2k',
        subArtist: []
      },
      {
        id: Mp3.XemNhuTaChuaTung.id,
        url: '/media/xem-nhu-ta-chua-tung',
        mainArtist: {
          id: 'lequyen',
          name: 'Lệ-Quyên',
          profileUrl: '/profile/Lệ-Quyên'
        },
        artwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/7/3/a/1/73a1b73208c4b50b6abef00b6a3907f8.jpg',
        mediaUrl: Mp3.XemNhuTaChuaTung.url,
        songName: 'Xem Như Ta Chưa Từng',
        songDuration: 197,
        listenTimes: '195.2k',
        subArtist: []
      },
    ]
  },
  {
    id: 'hanhi',
    name: 'Hà-Nhi',
    birthdate: '02/04/1981',
    nativePlace: 'Hà Nội',
    realName: 'Hà-Nhi',
    profileUrl: '/profile/Hà-Nhi',
    description: `Sinh ra và lớn lên trong một gia đình không có truyền thống nghệ thuật nhưng Hà Nhi bộc lộ năng khiếu ca hát và niềm đam mê với âm nhạc từ rất bé.
      Năm 2015, cô được công chúng biết đến khi tham gia cuộc thi VietNam Idol. Dù dừng lại tại vòng 4 nhưng cô đã để lại một dấu ấn tốt đẹp trong lòng khán giả qua giọng hát và cá tính âm nhạc của mình.
      Với chất giọng đầy nội lực, khả năng xử lý ca khúc tốt, Hà Nhi hứa hẹn là nhân tố triển vọng của âm nhạc Việt. Tuy nhiên những sản phẩm âm nhạc sau đó của cô không được thành công như mong đợi.
      Năm 2022, Hà Nhi ra mắt ca khúc "Ai Rồi Cũng Sẽ Khác".
      Ngoài ra, cô gây ấn tượng với những bản cover như "Từng Cho Nhau", "Ảo Mộng Tình Yêu"...`,
    artwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/c/5/d/b/c5dbc8fad12e47094496041efa689f21.jpg',
    subArtwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/5/e/5/9/5e59302e5881708cb601c335894fbfe5.jpg',
    songs: [
      TOP_100_ALL[1]
    ]
  },
  {
    id: 'hongocha',
    name: 'Hồ-Ngọc-Hà',
    birthdate: ' 25 tháng 11, 1984 (37 tuổi)',
    nativePlace: 'Huế',
    realName: 'Hồ Ngọc Hà',
    profileUrl: '/profile/Hà-Nhi',
    description: `Hồ Ngọc Hà hay Hà Hồ là một nữ ca sĩ, diễn viên, người mẫu và giám khảo chương trình người Việt Nam. Hà Hồ bắt đầu sự nghiệp người mẫu từ năm 15 tuổi với chiều cao ấn tượng 1m72 và đạt nhiều giải thưởng. Cô chuyển sang ca hát bằng việc ra mắt album đầu tay 24 giờ 7 ngày năm 2004`,
    artwork: 'https://data.chiasenhac.com/data/cover/41/40073.jpg',
    subArtwork: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/avatars/5/e/5/9/5e59302e5881708cb601c335894fbfe5.jpg',
    songs: [
      TOP_100_ALL[2]
    ]
  }
];

export const audioContext = new AudioContext();
export const audioElement = document.querySelector('audio')!;
audioElement.crossOrigin = 'anonymous';
export const audioSource = audioContext.createMediaElementSource(audioElement);
export const analyser = audioContext.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioContext.destination);
analyser.fftSize = 128;
export const SCREEN_SIZE = (innerWidth - 240 - 330 - 120);
export const bufferLength = analyser.frequencyBinCount;
export const dataArray = new Uint8Array(bufferLength);
export const barWidth = (881 + 4) / bufferLength - 4;
