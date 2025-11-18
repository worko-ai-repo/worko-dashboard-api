// Import configs
import APP_CONSTANTS from "../configs/constants.config";

// Import DTOs
import {
  ElasticsearchRecordListingFilterOptions,
  ElasticsearchRecordListingFilterRequestDTO,
} from "../dtos/Common.elasticsearch.dto";

// Import enums
import { ElasticsearchSortOrderTypeEnum } from "../enums/Common.elasticsearch.enum";

// Import helper
import { elasticsearchBase64EncodeStrToLastKey } from "./elasticsearch.helper";

/**
 * ElasticsearchRequestHelper
 *
 * Helper to help with parsing/processing the request payloads.
 */
class ElasticsearchRequestHelper {
  /**
   * parseFilterOptions
   *
   * Parses the filter options for a given entity(Company,Subscription,User,Referral.. etc) listing request.
   *
   * It reads the "filterOptions" received from the request and parses it in a way we/backend is expecting it to be.
   *
   * @param {EntityListingFilterRequestDTO} filterOptions - The filter options for the entity listing request.
   * @return {EntityListingFilterOptions} The parsed filter options.
   */
  static parseFilterOptions<
    EntityListingFilterRequestDTO extends ElasticsearchRecordListingFilterRequestDTO,
    EntityListingFilterOptions extends ElasticsearchRecordListingFilterOptions
  >(filterOptions: EntityListingFilterRequestDTO): EntityListingFilterOptions {
    // pageSize
    let pageSize: number = parseInt(
      filterOptions.pageSize as unknown as string
    );

    // if pageSize is not present in one of PAGE_LENGTH_OPTIONS, then set pageSize to PAGE_LENGTH_DEFAULT
    if (APP_CONSTANTS.PAGE_LENGTH_OPTIONS.indexOf(pageSize) === -1) {
      pageSize = APP_CONSTANTS.PAGE_LENGTH_DEFAULT;
    }

    // lastKey
    let lastKey = undefined;
    if (filterOptions?.lastKey && filterOptions.lastKey !== "undefined") {
      global.logger.info(`LastKey exists: `, {
        filterOptionsLastKey: filterOptions.lastKey,
      });
      let decodedNumber: any[] | undefined =
        elasticsearchBase64EncodeStrToLastKey(filterOptions.lastKey); // decoding base64 string to original value(possibly array of values)
      if (decodedNumber) {
        lastKey = decodedNumber;
      }
    }

    // If sortOrder is undefined, then set sortOrder to descending order by default
    if (!filterOptions?.sortOrder) {
      filterOptions.sortOrder = ElasticsearchSortOrderTypeEnum.DESCENDING;
    }

    if (filterOptions.searchText) {
      filterOptions.searchText = filterOptions.searchText.trim();
    }

    let newFilterOptions = {
      ...filterOptions,
      ...{
        pageSize: pageSize,
        lastKey: lastKey,
        searchText: filterOptions.searchText,
      },
    };
    return newFilterOptions as unknown as EntityListingFilterOptions;
  }
}

// Export ElasticsearchRequestHelper
export { ElasticsearchRequestHelper };
