using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using Domain;

namespace Services
{
    public class MemberService
    {
        private const string URL = "http://3.87.164.157:23450/";

        public Member GetMember(int memberId)
        {
            string urlParameters = $"/auth/member/{memberId}";

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
                var dataObject = response.Content.ReadAsAsync<Member>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
                client.Dispose();
                return dataObject;
                
            }
            else
            {
                client.Dispose();
                return null;
            }

        }
    }
}
