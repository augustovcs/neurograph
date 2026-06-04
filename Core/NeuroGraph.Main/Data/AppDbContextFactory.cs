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
        // Usa o diretório do projeto, não do processo — garante achar os appsettings
        // independente de onde o dotnet ef for chamado.
        var basePath = Path.GetFullPath(
            Path.Combine(AppContext.BaseDirectory, "..", "..", ".."));

        var config = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var connectionString = config.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException(
                $"Connection string 'DefaultConnection' não encontrada. BasePath: {basePath}");

        Console.WriteLine($"[Factory] BasePath: {basePath}");
        Console.WriteLine($"[Factory] ConnStr: {connectionString[..Math.Min(60, connectionString.Length)]}...");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder
            .UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention();

        return new AppDbContext(optionsBuilder.Options);
    }
}
