export type ApiConfigType = {
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  RATE_LIMIT_DEFAULT_MESSAGE: string;

  // API Payload Size
  API_MAX_PAYLOAD_SIZE: string;
  API_MAX_URL_ENCODED_SIZE: string;
};
