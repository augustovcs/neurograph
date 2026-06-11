namespace Neurograph.Services
{
    public class BehaviorSettings
    {
      public double FireChancePerTick { get; set; } = 0.05; // 5% de disparar por tick
      public double EvolveChancePerTick { get; set; } = 0.01; // 1% de evoluir por tick
      public double DeathChancePerTick { get; set; } = 0.005; // 0.5% de morrer por tick
      public double EnergyCostPerFire { get; set; } = 1.0; // disparar gasta energia
    }
}