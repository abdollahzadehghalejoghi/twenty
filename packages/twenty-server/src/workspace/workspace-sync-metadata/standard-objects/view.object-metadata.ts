import { FieldMetadataType } from 'src/metadata/field-metadata/field-metadata.entity';
import { RelationMetadataType } from 'src/metadata/relation-metadata/relation-metadata.entity';
import { FieldMetadata } from 'src/workspace/workspace-sync-metadata/decorators/field-metadata.decorator';
import { IsNullable } from 'src/workspace/workspace-sync-metadata/decorators/is-nullable.decorator';
import { IsSystem } from 'src/workspace/workspace-sync-metadata/decorators/is-system.decorator';
import { ObjectMetadata } from 'src/workspace/workspace-sync-metadata/decorators/object-metadata.decorator';
import { RelationMetadata } from 'src/workspace/workspace-sync-metadata/decorators/relation-metadata.decorator';
import { BaseObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/base.object-metadata';
import { ViewFieldObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-field.object-metadata';
import { ViewFilterObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-filter.object-metadata';
import { ViewSortObjectMetadata } from 'src/workspace/workspace-sync-metadata/standard-objects/view-sort.object-metadata';

@ObjectMetadata({
  namePlural: 'views',
  labelSingular: 'نما',
  labelPlural: 'نماها',
  description: '(System) Views',
  icon: 'IconLayoutCollage',
})
@IsSystem()
export class ViewObjectMetadata extends BaseObjectMetadata {
  @FieldMetadata({
    type: FieldMetadataType.TEXT,
    label: 'نام',
    description: 'نام نما',
  })
  name: string;

  @FieldMetadata({
    type: FieldMetadataType.UUID,
    label: 'Object Metadata Id',
    description: 'View target object',
  })
  objectMetadataId: string;

  @FieldMetadata({
    type: FieldMetadataType.TEXT,
    label: 'نوع',
    description: 'نوع نما',
    defaultValue: { value: 'table' },
  })
  type: string;

  @FieldMetadata({
    type: FieldMetadataType.BOOLEAN,
    label: 'Compact View',
    description: 'Describes if the view is in compact mode',
    defaultValue: { value: false },
  })
  isCompact: boolean;

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'فیلد های نما',
    description: 'فیلد های نما',
    icon: 'IconTag',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewField',
  })
  @IsNullable()
  viewFields: ViewFieldObjectMetadata[];

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'فیلترهای نما',
    description: 'فیلترهای نما',
    icon: 'IconFilterBolt',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewFilter',
  })
  @IsNullable()
  viewFilters: ViewFilterObjectMetadata[];

  @FieldMetadata({
    type: FieldMetadataType.RELATION,
    label: 'مرتب سازی های نما',
    description: 'مرتب سازی های نما',
    icon: 'IconArrowsSort',
  })
  @RelationMetadata({
    type: RelationMetadataType.ONE_TO_MANY,
    objectName: 'viewSort',
  })
  @IsNullable()
  viewSorts: ViewSortObjectMetadata[];
}
