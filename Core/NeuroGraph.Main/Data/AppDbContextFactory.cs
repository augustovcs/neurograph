using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NeuroGraph.Main.Data;

/// <summary>
/// Usada EXCLUSIVAMENTE pelo dotnet ef em design-time (migrations, scaffold, database update).
/// Garante que o ambiente Development seja carregado sem precisar setar variável de ambiente.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        // Sobe do bin/Debug|Release/net8.0 até a raiz do projeto procurando o .csproj.
        var basePath = AppContext.BaseDirectory;
        while (!Directory.GetFiles(basePath, "*.csproj").Any())
            basePath = Directory.GetParent(basePath)!.FullName;

        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                $"Connection string 'DefaultConnection' não encontrada. BasePath: {basePath}");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder
            .UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention();

        return new AppDbContext(optionsBuilder.Options);
    }
}
