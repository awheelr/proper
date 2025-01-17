namespace Proper.Server.Contracts.V1.Services {
    public interface IOpenAIService {
        /// <summary>
        /// Fixes the grammar of the provided input text.
        /// </summary>
        /// <param name="inputText">The text to be corrected.</param>
        /// <returns>The corrected text with improved grammar.</returns>
        Task<string> FixGrammarAsync(string inputText);
    }
}
