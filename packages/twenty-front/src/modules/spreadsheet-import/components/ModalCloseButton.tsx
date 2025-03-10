import styled from '@emotion/styled';

import { useSpreadsheetImportInitialStep } from '@/spreadsheet-import/hooks/useSpreadsheetImportInitialStep';
import { useSpreadsheetImportInternal } from '@/spreadsheet-import/hooks/useSpreadsheetImportInternal';
import { IconX } from '@/ui/display/icon/index';
import { useDialogManager } from '@/ui/feedback/dialog-manager/hooks/useDialogManager';
import useI18n from '@/ui/i18n/useI18n';
import { IconButton } from '@/ui/input/button/components/IconButton';
import { useStepBar } from '@/ui/navigation/step-bar/hooks/useStepBar';

const StyledCloseButtonContainer = styled.div`
  align-items: center;
  aspect-ratio: 1;
  display: flex;
  height: 60px;
  justify-content: center;
  position: absolute;
  right: 0;
  top: 0;
`;

type ModalCloseButtonProps = {
  onClose: () => void;
};

export const ModalCloseButton = ({ onClose }: ModalCloseButtonProps) => {
  const { initialStepState } = useSpreadsheetImportInternal();
  const { translate } = useI18n('translations');

  const { initialStep } = useSpreadsheetImportInitialStep(
    initialStepState?.type,
  );

  const { activeStep } = useStepBar({
    initialStep,
  });

  const { enqueueDialog } = useDialogManager();

  const handleClose = () => {
    if (activeStep === -1) {
      onClose();
      return;
    }
    enqueueDialog({
      title: translate('exitImportFlow'),
      message: translate('confirmInfoNotSave'),
      buttons: [
        { title: 'Cancel' },
        {
          title: translate('exit'),
          onClick: onClose,
          accent: 'danger',
          role: 'confirm',
        },
      ],
    });
  };

  return (
    <StyledCloseButtonContainer>
      <IconButton Icon={IconX} onClick={handleClose} />
    </StyledCloseButtonContainer>
  );
};
