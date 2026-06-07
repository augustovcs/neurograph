namespace Neurograph.Services
{
    public class BehaviorSettings
    {
      public double FireChancePerTick { get; set; } = 0.05;
      public double EvolveChancePerTick { get; set; } = 0.01;
      public double DeathChancePerTick { get; set; } = 0.005;
      public double EnergyCostPerFire { get; set; } = 1.0;
    }
}