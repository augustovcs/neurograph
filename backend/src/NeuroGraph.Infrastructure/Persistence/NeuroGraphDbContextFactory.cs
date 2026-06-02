using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace NeuroGraph.Infrastructure.Persistence;

/// <summary>
/// Factory de design-time usada pelo <c>dotnet ef</c> para criar migrations
/// sem subir a aplicação. Usa a connection string do ambiente
/// <c>NEUROGRAPH_CONNECTION</c> ou um padrão local.
/// </summary>
public class NeuroGraphDbContextFactory : IDesignTimeDbContextFactory<NeuroGraphDbContext>
{
    public NeuroGraphDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("NEUROGRAPH_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=neurograph;Username=postgres;Password=postgres";

        var options = new DbContextOptionsBuilder<NeuroGraphDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new NeuroGraphDbContext(options);
    }
}
