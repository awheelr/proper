namespace Proper.Server.Utilities {
    public static class EnvironmentValidator {
        public static void ValidateEnvironmentVariables() {
            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY", EnvironmentVariableTarget.User);
            if (string.IsNullOrEmpty(apiKey)) {
                throw new InvalidOperationException("OpenAI API key is not configured.");
            }
        }
    }
}
