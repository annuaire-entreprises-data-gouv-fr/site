export type IODSResponse =
  | {
      records: {
        datasetid: string;
        recordid: string;
        fields: any;
      }[];
    }
  | {
      results: any[];
    };

export interface IODSMetadata {
  metas: {
    modified: string;
    metadata_processed: string;
    data_processed: string;
  };
}
