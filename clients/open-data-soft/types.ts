interface IODSCoreResponse {
  nhits: number;
  parameters?: {
    rows: number;
    start: number;
  };
}

export type IODSResponse = IODSCoreResponse &
  (
    | {
        records: {
          datasetid: string;
          recordid: string;
          fields: any;
        }[];
      }
    | {
        results: any[];
      }
  );

export interface IODSMetadata {
  metas: {
    modified: string;
    metadata_processed: string;
    data_processed: string;
  };
}
