using Microsoft.EntityFrameworkCore;
using Api.Entities;
using Api.Entities.Views;

namespace NeuroGraph.Main.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Neuron> Neurons => Set<Neuron>();
    public DbSet<BiologicalEvent> BiologicalEvents => Set<BiologicalEvent>();
    public DbSet<BiologicalSignal> BiologicalSignals => Set<BiologicalSignal>();
    public DbSet<NeuralConnection> NeuralConnections => Set<NeuralConnection>();
    public DbSet<NeuronLog> NeuronLogs => Set<NeuronLog>();

    /// Views
    public DbSet<NeuronLongevityView> NeuronLongevity => Set<NeuronLongevityView>();
    public DbSet<NeuronDeathStatsView> NeuronDeathStats => Set<NeuronDeathStatsView>();
    public DbSet<BestEventView> BestEvents => Set<BestEventView>();

    ///
    /// 
    /// 
    ///
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NeuronLog>().ToTable("neurons_logs");

        modelBuilder.Entity<NeuralConnection>()
            .HasOne<Neuron>().WithMany()
            .HasForeignKey(c => c.SourceNeuronId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NeuralConnection>()
            .HasOne<Neuron>().WithMany()
            .HasForeignKey(c => c.TargetNeuronId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<NeuronLongevityView>()
            .HasNoKey()
            .ToView("vw_neuron_longevity");
    
        modelBuilder.Entity<NeuronDeathStatsView>()
            .HasNoKey()
            .ToView("vw_neuron_death_stats");
    
        modelBuilder.Entity<BestEventView>()
            .HasNoKey()
            .ToView("vw_best_events");
    }
}