import { ChangeEvent, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { isNonEmptyArray } from '@sniptt/guards';

import { AttachmentList } from '@/activities/files/components/AttachmentList';
import { DropZone } from '@/activities/files/components/DropZone';
import { useAttachments } from '@/activities/files/hooks/useAttachments';
import { useUploadAttachmentFile } from '@/activities/files/hooks/useUploadAttachmentFile';
import { ActivityTargetableObject } from '@/activities/types/ActivityTargetableEntity';
import { IconPlus } from '@/ui/display/icon';
import useI18n from '@/ui/i18n/useI18n';
import { Button } from '@/ui/input/button/components/Button';
import AnimatedPlaceholder from '@/ui/layout/animated-placeholder/components/AnimatedPlaceholder';
import {
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from '@/ui/layout/animated-placeholder/components/EmptyPlaceholderStyled';

const StyledAttachmentsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: auto;
`;

const StyledFileInput = styled.input`
  display: none;
`;

const StyledDropZoneContainer = styled.div`
  height: 100%;
  padding: ${({ theme }) => theme.spacing(6)};
`;

export const Attachments = ({
  targetableObject,
}: {
  targetableObject: ActivityTargetableObject;
}) => {
  const { translate } = useI18n('translations');
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { attachments } = useAttachments(targetableObject);
  const { uploadAttachmentFile } = useUploadAttachmentFile();

  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onUploadFile?.(e.target.files[0]);
  };

  const handleUploadFileClick = () => {
    inputFileRef?.current?.click?.();
  };

  const onUploadFile = async (file: File) => {
    await uploadAttachmentFile(file, targetableObject);
  };

  if (!isNonEmptyArray(attachments)) {
    return (
      <StyledDropZoneContainer onDragEnter={() => setIsDraggingFile(true)}>
        {isDraggingFile ? (
          <DropZone
            setIsDraggingFile={setIsDraggingFile}
            onUploadFile={onUploadFile}
          />
        ) : (
          <AnimatedPlaceholderEmptyContainer>
            <AnimatedPlaceholder type="noFile" />
            <AnimatedPlaceholderEmptyTextContainer>
              <AnimatedPlaceholderEmptyTitle>
                {translate('noFiles')}
              </AnimatedPlaceholderEmptyTitle>
              <AnimatedPlaceholderEmptySubTitle>
                {translate('thereAreNoAssociatedFiles')}
              </AnimatedPlaceholderEmptySubTitle>
            </AnimatedPlaceholderEmptyTextContainer>
            <StyledFileInput
              ref={inputFileRef}
              onChange={handleFileChange}
              type="file"
            />
            <Button
              Icon={IconPlus}
              title={translate('addFile')}
              variant="secondary"
              onClick={handleUploadFileClick}
            />
          </AnimatedPlaceholderEmptyContainer>
        )}
      </StyledDropZoneContainer>
    );
  }

  return (
    <StyledAttachmentsContainer>
      <StyledFileInput
        ref={inputFileRef}
        onChange={handleFileChange}
        type="file"
      />
      <AttachmentList
        targetableObject={targetableObject}
        title={translate('all')}
        attachments={attachments ?? []}
        button={
          <Button
            Icon={IconPlus}
            size="small"
            variant="secondary"
            title={translate('addFile')}
            onClick={handleUploadFileClick}
          ></Button>
        }
      />
    </StyledAttachmentsContainer>
  );
};
