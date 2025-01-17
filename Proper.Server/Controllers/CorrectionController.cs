using Microsoft.AspNetCore.Mvc;
using Proper.Server.Contracts.V1;
using Proper.Server.Contracts.V1.Models;
using Proper.Server.Contracts.V1.Services;

namespace Proper.Server.Controllers {
    [ApiController]
    public class CorrectionController : ControllerBase
    {
        private readonly IOpenAIService _openAIService;
        public CorrectionController(IOpenAIService openAIService) {
            _openAIService = openAIService;
        }

        [HttpPost(ApiRoutes.Correction.RetrieveMock)]
        public async Task<IActionResult> RetrieveCorrection([FromBody] CorrectionRequest inputText) {
            if(string.IsNullOrEmpty(inputText.Text)) {
                return StatusCode(500, "Content's of prompt cannot be null or empty.");
            }

            try {
                string correctedText = await _openAIService.FixGrammarAsync(inputText.Text);
                return Ok(new { correctedText });
            } catch (Exception ex) {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost(ApiRoutes.Correction.Retrieve)]
        public IActionResult RetrieveCorrectionMock([FromBody] CorrectionRequest request) {
            if (request == null || string.IsNullOrEmpty(request.Text)) {
                return StatusCode(500, "Content's of prompt cannot be null or empty.");
            }

            // Process the text (e.g., grammar checking logic)
            var response = new {
                OriginalText = request.Text,
                CorrectedText = $"This is a corrected version: {request.Text}." 
            };

            return Ok(response);
        }
    }
}
