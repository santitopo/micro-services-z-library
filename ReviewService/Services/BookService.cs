using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Domain;

namespace Services
{
    public class BookService
    {
        private const string URL = "http://52.5.82.144:23450/";

        public int GetBookId(string isbn, int organizationId)
        {
            string urlParameters = $"books/organization/{organizationId}?isbn={isbn}";

            HttpClient client = new HttpClient();
            client.BaseAddress = new Uri(URL);

            // Add an Accept header for JSON format.
            client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json"));

            // List data response.
            HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
            if (response.IsSuccessStatusCode)
            {
                // Parse the response body.
                var dataObject = response.Content.ReadAsAsync<Book>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                client.Dispose();
                return dataObject.Id;
                
            }
            else
            {
                client.Dispose();
                return 0;
            }
        }
    }
}
