using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using NeuroGraph.Main.Data;
using NeuroGraph.Main.Services;
using NeuroGraph.Main.Entities;
using Xunit;

namespace NeuroGraph.Tests;

public class NeuronBehaviorServiceTests
{
    private AppDbContext GetInMemoryDbContext()
    {
        var connection = new SqliteConnection("DataSource=:memory:");
        connection.Open();

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseSqlite(connection)
            .Options;

        var context = new AppDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }

    [Fact]
    public async Task RunTickAsync_ShouldUpdateNeuronsAccordingToBehaviorSettings()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var settings = new BehaviorSettings
        {
            FireChancePerTick = 1.0, // 100% chance to fire
            EvolveChancePerTick = 0.0, // 0% chance to evolve
            DeathChancePerTick = 0.0, // 0% chance to die
            EnergyCostPerFire = 1.0
        };
        var service = new NeuronBehaviorService(db, settings);

        var neuron = new Neuron { Status = "alive", Energy = 10.0 };
        db.Neurons.Add(neuron);
        await db.SaveChangesAsync();

        // Act
        await service.RunTickAsync();

        // Assert
        var updatedNeuron = await db.Neurons.FindAsync(neuron.Id);
        Assert.Equal("alive", updatedNeuron.Status);
        Assert.Equal(9.0, updatedNeuron.Energy); // Energy should decrease by 1.0 due to firing

        var signal = await db.BiologicalSignals.FirstOrDefaultAsync(s => s.NeuronId == neuron.Id);
        Assert.NotNull(signal); // A signal should have been created

        var log = await db.NeuronLogs.FirstOrDefaultAsync(l => l.NeuronId == neuron.Id && l.Type == "fired");
        Assert.NotNull(log); // A log entry for firing should have been created
    }
}