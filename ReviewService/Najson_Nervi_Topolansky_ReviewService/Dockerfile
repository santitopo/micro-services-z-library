#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80



FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["Najson_Nervi_Topolansky_ReviewService/WebAPI.csproj", "Najson_Nervi_Topolansky_ReviewService/"]
COPY ["ServicesInterface/ServicesInterface.csproj", "ServicesInterface/"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Repository/Repository.csproj", "Repository/"]
COPY ["RepositoryInterface/RepositoryInterface.csproj", "RepositoryInterface/"]
COPY ["Services/Services.csproj", "Services/"]
RUN dotnet restore "Najson_Nervi_Topolansky_ReviewService/WebAPI.csproj"
COPY . .
WORKDIR "/src/Najson_Nervi_Topolansky_ReviewService"
RUN dotnet build "WebAPI.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "WebAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]
