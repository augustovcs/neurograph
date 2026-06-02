using Microsoft.EntityFrameworkCore;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence;

public class NeuroGraphDbContext : DbContext
{
    public NeuroGraphDbContext(DbContextOptions<NeuroGraphDbContext> options) : base(options)
    {
    }

    public DbSet<Neuron> Neurons => Set<Neuron>();
    public DbSet<NeuronLog> NeuronLogs => Set<NeuronLog>();
    public DbSet<NeuralConnection> NeuralConnections => Set<NeuralConnection>();
    public DbSet<BiologicalSignal> BiologicalSignals => Set<BiologicalSignal>();
    public DbSet<BiologicalEvent> BiologicalEvents => Set<BiologicalEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(NeuroGraphDbContext).Assembly);
    }
}
