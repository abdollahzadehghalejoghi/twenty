import { useRecoilValue } from 'recoil';

import { useCommandMenu } from '@/command-menu/hooks/useCommandMenu';
import useI18n from '@/ui/i18n/useI18n';
import { useScopedHotkeys } from '@/ui/utilities/hotkey/hooks/useScopedHotkeys';
import { AppHotkeyScope } from '@/ui/utilities/hotkey/types/AppHotkeyScope';

import {
  keyboardShortcutsGeneral,
  keyboardShortcutsTable,
} from '../constants/keyboardShortcuts';
import { useKeyboardShortcutMenu } from '../hooks/useKeyboardShortcutMenu';
import { isKeyboardShortcutMenuOpenedState } from '../states/isKeyboardShortcutMenuOpenedState';

import { KeyboardMenuDialog } from './KeyboardShortcutMenuDialog';
import { KeyboardMenuGroup } from './KeyboardShortcutMenuGroup';
import { KeyboardMenuItem } from './KeyboardShortcutMenuItem';

export const KeyboardShortcutMenu = () => {
  const { translate } = useI18n('translations');
  const { toggleKeyboardShortcutMenu, closeKeyboardShortcutMenu } =
    useKeyboardShortcutMenu();
  const isKeyboardShortcutMenuOpened = useRecoilValue(
    isKeyboardShortcutMenuOpenedState,
  );
  const { closeCommandMenu } = useCommandMenu();
  useScopedHotkeys(
    'shift+?,meta+?',
    () => {
      closeCommandMenu();
      toggleKeyboardShortcutMenu();
    },
    AppHotkeyScope.KeyboardShortcutMenu,
    [toggleKeyboardShortcutMenu],
  );

  useScopedHotkeys(
    'esc',
    () => {
      closeKeyboardShortcutMenu();
    },
    AppHotkeyScope.KeyboardShortcutMenu,
    [toggleKeyboardShortcutMenu],
  );

  return (
    <>
      {isKeyboardShortcutMenuOpened && (
        <KeyboardMenuDialog onClose={toggleKeyboardShortcutMenu}>
          <KeyboardMenuGroup heading={translate('table')}>
            {keyboardShortcutsTable.map((TableShortcut) => (
              <KeyboardMenuItem shortcut={TableShortcut} />
            ))}
          </KeyboardMenuGroup>
          <KeyboardMenuGroup heading={translate('general')}>
            {keyboardShortcutsGeneral.map((GeneralShortcut) => (
              <KeyboardMenuItem shortcut={GeneralShortcut} />
            ))}
          </KeyboardMenuGroup>
        </KeyboardMenuDialog>
      )}
    </>
  );
};
