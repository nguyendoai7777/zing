import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ReactElement, Ref } from 'react';
import { Dialog, DialogTitle, Fade, Slide } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { Link } from 'react-router-dom';
import './navbar.css';
import { DEFAULT_THEME, StorageKey, ThemeOptions } from '@const';
import type { ThemeBase, ThemeChar, ThemeColor } from '@typing';
import type { CreatePlaylistDialogProps } from '../../screens/personal/components/create-playlist-dialog/create-playlist-dialog.tsx';
import { CustomButtonOutlined } from '@components/custom-buttom';
import { setTheme } from '@utils';
import DIconButton from '@components/icon-button';

function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
    ref?: Ref<unknown>;
  }
) {
  return <Slide direction="down" ref={props.ref} {...props} children={props.children} />;
}

const CHAR_THEME_LIST = ThemeOptions.chars as ThemeChar[];
const COLOR_THEME_LIST = ThemeOptions.color as ThemeColor[];

type SelectThemeDialogProps = Omit<CreatePlaylistDialogProps, 'currentSong'>;

const SelectThemeDialog: FCC<SelectThemeDialogProps> = ({ open, onClose }) => {
  const currentTheme = localStorage.getItem(StorageKey.SetTheme) || `${DEFAULT_THEME}-theme`;
  const [currentSelectedTheme, setCurrentSelectedTheme] = useState('');

  const selectedTheme = (theme: ThemeBase, index: number) => {
    setTheme(theme);
    setCurrentSelectedTheme(theme.id);
  };
  useEffect(() => {
    setCurrentSelectedTheme(currentTheme);
  }, []);
  return (
    <Dialog
      slots={{
        transition: Transition,
      }}
      className="dialog-main"
      open={open}
      onClose={onClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <h3 className="dialog-header">Lựa chọn giao diện</h3>
      <div className="dialog-max-body my-scrollbar">
        <div style={{ marginRight: '-10px' }}>
          <DialogTitle>Theo màu</DialogTitle>
          <div className="flex flex-wrap color-picker-group">
            {COLOR_THEME_LIST.map((e, i) => (
              <div key={e.id} onClick={() => selectedTheme(e, i)} className="color-picker-box cs-pointer relative">
                {e.id === currentSelectedTheme && <div className="text-picker">Đang chọn</div>}
                <div className={`color-picker ${e.id === currentSelectedTheme && 'theme-selected'}`} style={{ backgroundColor: e.ref }} />
                <div className="char-name">{e.name}</div>
              </div>
            ))}
          </div>
          <DialogTitle>Theo nhân vật</DialogTitle>
          <div className="flex flex-wrap color-picker-group gr-av">
            {CHAR_THEME_LIST.map((e, i) => (
              <div className="avatar-background-picker relative" onClick={() => selectedTheme(e, i)} key={e.id}>
                {e.id === currentSelectedTheme && <div className="text-picker">Đang chọn</div>}
                <img src={e.avatarRef} className={e.id === currentSelectedTheme ? 'theme-selected' : ''} alt="" />
                <div className="char-name">{e.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="fj-end align-items-center" style={{ minHeight: '70px', margin: '0 24px' }}>
        <CustomButtonOutlined className="dialog-end-btn" hovercolor="B0B0B0FF" textcolor="grey" onClick={onClose} text="Đóng" />
      </div>
    </Dialog>
  );
};

export function Navbar() {
  const currentTheme = localStorage.getItem(StorageKey.SetTheme) || `${DEFAULT_THEME}-theme`;
  const navRef = useRef<HTMLDivElement | null>(null);
  const inpRef = useRef<HTMLInputElement | null>(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [inpFocus, setInpFocus] = useState(false);
  const [currentSelectedTheme, setCurrentSelectedTheme] = useState('');
  useEffect(() => {
    navRef.current?.setAttribute('_nav_scope', '');
    setCurrentSelectedTheme(currentTheme);
  }, []);

  const inpChange = (e: ChangeEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setSearchText(value);
  };

  const selectedTheme = (theme: ThemeBase, index: number) => {
    setTheme(theme);
    setCurrentSelectedTheme(theme.id);
  };

  return (
    <>
      <div className="d-navbar flex items-center justify-center flex-1 sticky top-0 z-10" ref={navRef}>
        <div className="fa-center nav-leading">
          <Link to="discovery" className="text-decoration-none back-home">
            <DIconButton shape="circle" siz="60px" cls="action-button">
              <svg className="redirect-home">
                <use href="#Home" />
              </svg>
            </DIconButton>
          </Link>
          <div className={`search-box fa-center ${inpFocus && searchText ? 's_active' : ''}`}>
            <svg className="sic absolute">
              <use href="#Search" />
            </svg>
            <input
              style={{
                borderBottomLeftRadius: inpFocus && searchText ? 0 : '25px',
                borderBottomRightRadius: inpFocus && searchText ? 0 : '25px',
              }}
              placeholder="Tìm mọi thứ ..."
              ref={inpRef}
              value={searchText}
              className="sip"
              type="text"
              onChange={inpChange}
              onFocus={() => setInpFocus(true)}
              onBlur={() => setInpFocus(false)}
            />
            {searchText && (
              <DIconButton
                cls="sctr absolute"
                shape="circle"
                onClick={() => {
                  setSearchText('');
                  inpRef.current?.focus();
                }}
              >
                <svg className="sct">
                  <use href="#SearchClear" />
                </svg>
              </DIconButton>
            )}
            {inpFocus && searchText && <div className="result-box absolute">Result</div>}
          </div>
        </div>
        <div className="main-actions fa-center">
          <DIconButton onClick={() => setOpenDialog(true)} shape="circle" siz="60px" cls="action-button">
            <img width="34px" src="/imgs/theme.svg" alt="" />
          </DIconButton>
          <DIconButton shape="circle" siz="60px" cls="action-button">
            <svg className="icon-style">
              <use href="#Setting" />
            </svg>
          </DIconButton>
        </div>
      </div>

      <SelectThemeDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  );
}

export default Navbar;
