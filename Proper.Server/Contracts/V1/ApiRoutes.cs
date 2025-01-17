namespace Proper.Server.Contracts.V1 {
    public static class ApiRoutes {
        public const string Root = "api";
        public const string Version = "v1";
        public const string Mocks = "mocks";
        public const string Base = Root + "/" + Version;

        public static class Correction {
            public const string Retrieve = Base + "/correction";
            public const string RetrieveMock = Base + "/" + Mocks + "/correction";

        }
    }
}
