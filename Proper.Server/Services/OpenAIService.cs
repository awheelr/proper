using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using Proper.Server.Contracts.V1.Services;

namespace Proper.Server.Services {
    public class OpenAIService : IOpenAIService {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OpenAIService> _logger;

        public OpenAIService(HttpClient httpClient, ILogger<OpenAIService> logger) {
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task<string> FixGrammarAsync(string inputText) {
            _logger.LogInformation(inputText);
            var apiKey = Environment.GetEnvironmentVariable("OpenAI_API_Key");

            string apiUrl = "https://api.openai.com/v1/chat/completions";

            var requestBody = new {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                new { role = "system", content = "You are a helpful assistant that fixes grammar." },
                new { role = "user", content = inputText }
                },  
                temperature = 0.7
            };

            var requestContent = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

            var response = await _httpClient.PostAsync(apiUrl, requestContent);

            if (response.IsSuccessStatusCode) {
                var responseContent = await response.Content.ReadAsStringAsync();

                // Deserialize to OpenAIResponse model
                var openAIResponse = JsonSerializer.Deserialize<OpenAIResponse>(responseContent);

                // Extract the fixed text
                return openAIResponse?.Choices?.FirstOrDefault()?.Message?.Content ?? "No response from OpenAI.";
            } else {
                throw new HttpRequestException($"OpenAI API call failed: {response.StatusCode} - {response.ReasonPhrase}");
            }
        }
    }

    public class OpenAIResponse {
        [JsonPropertyName("choices")]
        public Choice[] Choices { get; set; }

        public class Choice {
            [JsonPropertyName("message")]
            public Message Message { get; set; }
        }

        public class Message {
            [JsonPropertyName("content")]
            public string Content { get; set; }
        }
    }
}
