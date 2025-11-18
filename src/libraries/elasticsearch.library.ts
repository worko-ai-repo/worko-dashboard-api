// Import elasticsearch packages
import { Client } from "@elastic/elasticsearch";
import {
  AggregationsAggregate,
  BulkOperationType,
  BulkResponse,
  BulkResponseItem,
  DeleteByQueryRequest,
  DeleteByQueryResponse,
  ErrorCause,
  GetResponse,
  SearchHit,
  SearchRequest,
  SearchResponse,
  UpdateByQueryRequest,
  UpdateByQueryResponse,
  UpdateResponse,
  WriteResponseBase,
} from "@elastic/elasticsearch/lib/api/types";

// Import constants
import APP_CONSTANTS from "../configs/constants.config";

// Import dtos
import {
  ElasticsearchRecordListingFilterOptions,
  ElasticsearchRecordListingResponseDTO,
} from "../dtos/Common.elasticsearch.dto";

// Import utils
import { BaseError } from "../utils/errors.util";
import HttpStatusCode from "../utils/http-codes.util";

/**
 * ElasticSearchLibrary
 *
 * 1. Installation process of the Node.js client, shows you how to instantiate the client, and
 *    how to perform basic Elasticsearch operations with it:-
 *    @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/getting-started
 */
class ElasticSearchLibrary {
  /**
   * @constructor
   *
   * Initializes an instance of the ElasticSearchLibrary class.
   *
   * @throws {BaseError} If the necessary Elasticsearch environment variables
   * (cloud ID, endpoint, or API key) are not properly configured, logs an error
   * and throws a BaseError with an INTERNAL_SERVER_ERROR status.
   */
  constructor() {
    if (
      !process.env.APP_ELASTICSEARCH_CLOUD_ID ||
      !process.env.APP_ELASTICSEARCH_ENDPOINT ||
      !process.env.APP_ELASTICSEARCH_API_KEY
    ) {
      global.logger.error(
        "Elasticsearch environment variables are not properly configured.",
        {
          label: "ElasticsearchLibrary",
          meta: {
            cloudId:
              process.env.APP_ELASTICSEARCH_CLOUD_ID ?? "Cloud ID not found",
            endpoint:
              process.env.APP_ELASTICSEARCH_ENDPOINT ?? "Endpoint not found",
            apiKey:
              process.env.APP_ELASTICSEARCH_API_KEY ?? "API Key not found",
          },
        }
      );
      throw new BaseError(
        "Elasticsearch environment variables are not properly configured.",
        HttpStatusCode.INTERNAL_SERVER_ERROR_500
      );
    }
  }

  /**
   * initElasticSearchClient
   *
   * @description
   *    Initialises the elasticsearch client object, with the cloud id, node, and auth options.
   *    The options are fetched from the environment variables.
   * @returns {Client} The initialised elasticsearch client object.
   */
  initElasticSearchClient(): Client {
    let elasticSearchClient: Client;

    if (process.env.APP_STAGE == APP_CONSTANTS.STAGES.LOCAL) {
      /**
       * @todo: Configure the client for the "local" stage environment
       */
    }

    elasticSearchClient = new Client({
      cloud: {
        id: process.env.APP_ELASTICSEARCH_CLOUD_ID as string,
      },
      node: process.env.APP_ELASTICSEARCH_ENDPOINT,
      auth: {
        apiKey: process.env.APP_ELASTICSEARCH_API_KEY as string,
      },
    });

    return elasticSearchClient;
  }

  // Initialise the elasticsearch client
  elasticSearchClient = this.initElasticSearchClient();

  /**
   * createDocument
   *
   * Creates a document in the specified index with the given id.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/getting-started#_indexing_documents
   *
   * @param {string} id - The id of the document to be created.
   * @param {string} indexName - The name of the index to store the document in.
   * @param {EntityDto} document - The data of the document to be created.
   *
   * @returns {Promise<WriteResponseBase>} - A promise that resolves to the response from Elasticsearch after the document is created.
   */
  async createDocument<EntityDto>(
    id: string,
    indexName: string,
    document: EntityDto
  ): Promise<WriteResponseBase> {
    return this.elasticSearchClient.index<EntityDto>({
      index: indexName,
      id: id,
      document: document,
      refresh: true,
    });
  }

  /**
   * bulkCreateDocument
   *
   * Bulk indexes documents in an Elasticsearch index.
   *
   * This method sends a bulk request to the Elasticsearch client to perform
   * index actions. Each operation in the `operations` array can either be a
   * new document entry or an index action with metadata specifying the
   * document's index and ID. The method returns a promise that resolves to
   * `true` if all operations in the bulk request succeed, or `false` if any
   * operation fails.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/bulk_examples
   *
   * @param {(EntityDto | { index: { _index: string; _id: string; } })[]} operations
   *   An array of document entries and index actions to be processed in the
   *   bulk request.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if all
   *   operations in the bulk request succeed, or `false` if any operation
   *   fails.
   */
  async bulkCreateDocument<EntityDto>(
    operations: (
      | EntityDto
      | {
          index: {
            _index: string;
            _id: string;
          };
        }
    )[]
  ): Promise<boolean> {
    const bulkResponse: BulkResponse = await this.elasticSearchClient.bulk({
      operations: operations,
      refresh: true,
    });

    if (bulkResponse.errors) {
      const erroredDocuments: Array<{
        status: number;
        error: ErrorCause;
        operation:
          | EntityDto
          | {
              index: {
                _index: string;
                _id: string;
              };
            };
        document:
          | EntityDto
          | {
              index: {
                _index: string;
                _id: string;
              };
            };
      }> = [];
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach(
        (
          action: Partial<Record<BulkOperationType, BulkResponseItem>>,
          i: number
        ) => {
          const operation = Object.keys(action)[0] as BulkOperationType;
          if (action[operation]?.error) {
            erroredDocuments.push({
              // If the status is 429 it means that you can retry the document,
              // otherwise it's very likely a mapping error, and you should
              // fix the document before to try it again.
              status: action[operation].status,
              error: action[operation].error,
              operation: operations[i * 2],
              document: operations[i * 2 + 1],
            });
          }
        }
      );
      global.logger.debug(
        "Errored documents [ElasticSearch LIBRARY]",
        erroredDocuments
      );
    }

    // Returns `true` if all operations in the bulk request succeed and `false` if any operation fails
    return !bulkResponse.errors;
  }

  /**
   * getDocumentById
   *
   * Retrieves a document by its ID from the specified index.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/getting-started#_getting_documents
   *
   * @param {string} id - The ID of the document to retrieve.
   * @param {string} indexName - The name of the index to retrieve the document from.
   *
   * @returns {Promise<GetResponse<EntityDto>>} - A promise that resolves to the response from Elasticsearch after the document is retrieved.
   */
  async getDocumentById<EntityDto>(
    id: string,
    indexName: string
  ): Promise<GetResponse<EntityDto>> {
    return this.elasticSearchClient.get<EntityDto>({
      index: indexName,
      id: id,
    });
  }

  /**
   * getDocuments
   *
   * Retrieves a list of documents from the specified index based on the given filter options and search request body.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/rest-apis/paginate-search-results#search-after
   *
   * @param {SearchRequest} searchRequestBody - The search request body.
   * @param {EntityListingFilterOptions} entityFilterOptions - The filter options for the entity listing.
   *
   * @returns {Promise<ElasticsearchRecordListingResponseDTO<EntityDto[]>>} - A promise that resolves to the paginated result.
   */
  async getDocuments<
    EntityDto,
    EntityListingFilterOptions extends ElasticsearchRecordListingFilterOptions
  >(
    searchRequestBody: SearchRequest,
    entityFilterOptions: EntityListingFilterOptions
  ): Promise<ElasticsearchRecordListingResponseDTO<EntityDto[]>> {
    /**
     * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/search_examples
     */
    const elasticSearchResponse: SearchResponse<
      EntityDto,
      Record<string, AggregationsAggregate>
    > = await this.elasticSearchClient.search<EntityDto>(searchRequestBody);

    // Extract the hits from the response
    const hits: EntityDto[] = elasticSearchResponse.hits.hits.map(
      (hit: SearchHit<EntityDto>) => hit._source as EntityDto
    );

    // Prepare the paginated result
    const paginatedResult: ElasticsearchRecordListingResponseDTO<EntityDto[]> =
      {
        data: hits,
        pagination: {
          lastKey:
            hits.length === entityFilterOptions.pageSize
              ? Buffer.from(
                  JSON.stringify(
                    elasticSearchResponse.hits.hits[
                      elasticSearchResponse.hits.hits.length - 1
                    ].sort
                  )
                ).toString("base64")
              : undefined,
          count: hits.length,
          pageSize: entityFilterOptions.pageSize,
        },
      };

    return paginatedResult;
  }

  /**
   * updateDocumentById
   *
   * Updates a document by its ID in the specified index.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/getting-started#_updating_documents
   *
   * @param {string} id - The ID of the document to update.
   * @param {string} indexName - The name of the index.
   * @param {EntityUpdateDto} updateData - The data to update the document with.
   * @returns {Promise<UpdateResponse<DbEntityDto>>} - A promise that resolves to the result
   *   of the update operation.
   */
  async updateDocumentById<EntityUpdateDto, DbEntityDto>(
    id: string,
    indexName: string,
    updateData: EntityUpdateDto
  ): Promise<UpdateResponse<DbEntityDto>> {
    return this.elasticSearchClient.update<
      EntityUpdateDto,
      EntityUpdateDto,
      DbEntityDto
    >({
      index: indexName,
      id,
      doc: updateData,
      refresh: true,
    });
  }

  /**
   * updateDocumentsByQuery
   *
   * Executes an update by query operation in Elasticsearch.
   *
   * This method sends an update by query request to the Elasticsearch client.
   * The request includes a query that specifies which documents to update, and
   * a script that specifies how to update the matched documents.
   *
   * @see https://www.elastic.co/docs/reference/elasticsearch/clients/javascript/update_by_query_examples
   *
   * @param {UpdateByQueryRequest} updateQueryRequest - The request containing the
   *   details of the query and script for updating documents.
   *
   * @returns {Promise<UpdateByQueryResponse>} - A promise that resolves to the result of the update operation.
   */
  async updateDocumentsByQuery(
    updateQueryRequest: UpdateByQueryRequest
  ): Promise<UpdateByQueryResponse> {
    return this.elasticSearchClient.updateByQuery(updateQueryRequest);
  }

  /**
   * deleteDocumentsByQuery
   *
   * Executes a delete by query operation in Elasticsearch.
   *
   * This method sends a delete by query request to the Elasticsearch client.
   * The request includes a query that specifies which documents to delete.
   *
   * @param {DeleteByQueryRequest} deleteQueryRequest - The request containing the
   *   details of the query for deleting documents.
   * @returns {Promise<DeleteByQueryResponse>} - A promise that resolves to the
   *   response from Elasticsearch after the delete operation is performed.
   */
  async deleteDocumentsByQuery(
    deleteQueryRequest: DeleteByQueryRequest
  ): Promise<DeleteByQueryResponse> {
    // Return the delete query request
    return this.elasticSearchClient.deleteByQuery(deleteQueryRequest);
  }
}

export { ElasticSearchLibrary };
