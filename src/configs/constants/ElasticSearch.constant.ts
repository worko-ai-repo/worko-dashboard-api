/**
 * ELASTICSEARCH_APP_CONSTANTS
 */
const ELASTICSEARCH_APP_CONSTANTS = {
  /**
   * ELASTICSEARCH_CRUD_RESULTS
   *
   * @description
   *    1. Below is the type definition given by elasticsearch for the result of the CRUD operations on elasticsearch.
   *       type Result = 'created' | 'updated' | 'deleted' | 'not_found' | 'noop';
   */
  ELASTICSEARCH_CRUD_RESULTS: {
    CREATED: "created",
    UPDATED: "updated",
    DELETED: "deleted",
    NOT_FOUND: "not_found",
    NOOP: "noop",
  },
};

export { ELASTICSEARCH_APP_CONSTANTS };
