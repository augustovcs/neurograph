using NeuroGraph.Main.Interfaces;


namespace NeuroGraph.Main.Workers;
public class SimulationWorker : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SimulationWorker(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using var scope = _scopeFactory.CreateScope();

            var service = scope.ServiceProvider
                .GetRequiredService<INeuronBehaviorService>();

            await service.RunTickAsync();

            await Task.Delay(1000, stoppingToken);
        }
    }
}