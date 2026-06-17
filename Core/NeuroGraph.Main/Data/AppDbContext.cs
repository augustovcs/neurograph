using Microsoft.EntityFrameworkCore;
using NeuroGraph.Main.Entities;
using NeuroGraph.Main.Entities.Views;

namespace NeuroGraph.Main.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Tabelas
    public DbSet<Neuron> Neurons => Set<Neuron>();
    public DbSet<BiologicalEvent> BiologicalEvents => Set<BiologicalEvent>();
    public DbSet<BiologicalSignal> BiologicalSignals => Set<BiologicalSignal>();
    public DbSet<NeuralConnection> NeuralConnections => Set<NeuralConnection>();
    public DbSet<NeuronLog> NeuronLogs => Set<NeuronLog>();
    public DbSet<SimulationConfig> SimulationConfigs => Set<SimulationConfig>();

    // Views (read-only)
    public DbSet<NeuronLongevityView> NeuronLongevity => Set<NeuronLongevityView>();
    public DbSet<NeuronDeathStatsView> NeuronDeathStats => Set<NeuronDeathStatsView>();
    public DbSet<BestEventView> BestEvents => Set<BestEventView>();

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

        // Views
        modelBuilder.Entity<NeuronLongevityView>().HasNoKey().ToView("vw_neuron_longevity");
        modelBuilder.Entity<NeuronDeathStatsView>().HasNoKey().ToView("vw_neuron_death_stats");
        modelBuilder.Entity<BestEventView>().HasNoKey().ToView("vw_best_events");

        // SimulationConfig: cada parâmetro é um value object (owned) gravado como
        // colunas na própria linha (ex.: fire_chance_per_tick_value, _pinned, _min, _max).
        modelBuilder.Entity<SimulationConfig>(cfg =>
        {
            cfg.OwnsOne(c => c.FireChancePerTick);
            cfg.OwnsOne(c => c.EvolveChancePerTick);
            cfg.OwnsOne(c => c.DeathChancePerTick);
            cfg.OwnsOne(c => c.EnergyCostPerFire);
            cfg.OwnsOne(c => c.EnergyRegenPerTick);
        });
    }
}
