/**
 * elasticsearchlastKeyToBase64EncodeStr
 *
 * Encode the provided value into "Base64Encoded" string
 *
 * @description
 * This function takes the provided value and encodes it into a Base64 string. If the input is null, undefined, or an invalid array of values, it returns undefined.
 *
 * @example
 * const encodedValue = elasticsearchlastKeyToBase64EncodeStr([ 1740396641431, '1430704032' ]); // returns "WzE3NDAzOTY2NDE0MzEsIjE0MzA3MDQwMzIiXQ"
 *
 * @param {Array<any> | null | undefined} value - The value to encode. If not provided or invalid, returns undefined.
 * @returns {undefined | string} - The encoded value, or undefined if encoding fails or input is invalid.
 */
export function elasticsearchlastKeyToBase64EncodeStr(
  value?: Array<any>
): undefined | string {
  try {
    // If the provided value is `undefined` then return `undefined`
    if (!value) {
      return undefined;
    }

    // Return the encoded value
    return Buffer.from(JSON.stringify(value)).toString("base64");
  } catch (error: any) {
    // Logger message
    global.logger.error("Unable to perform Base64Encode.", {
      methodName: "elasticsearchlastKeyToBase64EncodeStr",
      error: error,
    });

    return undefined;
  }
}

/**
 * elasticsearchBase64EncodeStrToLastKey
 *
 * Decode the provided Base64Encoded string and pass it back.
 *
 * @param {string} str [OPTIONAL]
 * @returns {undefined | Array<any>}
 */
export function elasticsearchBase64EncodeStrToLastKey(
  str?: string
): undefined | Array<any> {
  try {
    // If the provided value is null, undefined, etc
    if (!str) {
      return undefined;
    }

    return JSON.parse(Buffer.from(str, "base64").toString("utf-8"));
  } catch (error: any) {
    // Logger message
    global.logger.error("Unable to perform Base64Decode.", {
      methodName: "elasticsearchBase64EncodeStrToLastKey",
      str: str,
      error: error,
    });
    return undefined;
  }
}
