using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NeuroGraph.Application.Neurons;
using NeuroGraph.Infrastructure.Persistence;
using NeuroGraph.Infrastructure.Services;

namespace NeuroGraph.Infrastructure;

public static class DependencyInjection
{
    /// <summary>
    /// Registra a camada de infraestrutura (EF Core + PostgreSQL).
    /// Connection string esperada em <c>ConnectionStrings:NeuroGraph</c>.
    /// </summary>
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("NeuroGraph");

        services.AddDbContext<NeuroGraphDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<INeuronService, NeuronService>();

        return services;
    }
}
