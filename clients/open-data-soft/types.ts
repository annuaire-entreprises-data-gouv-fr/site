export type IODSResponse = {
  records: {
    datasetid: string;
    recordid: string;
    fields: any;
  }[];
};

export type IODSMetadata = {
  metas: {
    modified: string;
    metadata_processed: string;
    data_processed: string;
  };
};
