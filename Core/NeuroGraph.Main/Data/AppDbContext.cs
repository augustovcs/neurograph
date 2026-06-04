using Microsoft.EntityFrameworkCore;
using Api.Entities;

namespace NeuroGraph.Main.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Os DbSet<> (tabelas) entram aqui na PRÓXIMA issue.
    public DbSet<Neuron> Neurons => Set<Neuron>();
    public DbSet<BiologicalEvent> BiologicalEvents => Set<BiologicalEvent>();
    public DbSet<BiologicalSignal> BiologicalSignals => Set<BiologicalSignal>();
    public DbSet<NeuralConnection> NeuralConnections => Set<NeuralConnection>();
    public DbSet<NeuronLog> NeuronLogs => Set<NeuronLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NeuralConnection>()
            .HasOne<Neuron>().WithMany()
            .HasForeignKey(c => c.SourceNeuronId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NeuralConnection>()
            .HasOne<Neuron>().WithMany()
            .HasForeignKey(c => c.TargetNeuronId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}