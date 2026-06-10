using Interfaces;
using Api.Entities;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
//using NeuroGraph.Main.Data;

namespace Services;

public class NeuronGenerationService : INeuronGenerationService
{
    public AppDbContext _dbContext;
    public NeuronGenerationService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
        
    }


    public async Task<bool> LowNeuronSpawn(int countNeurons)
    {
        
        var randomPit = new Random();
        var neurons = new List<Neuron>();
        var connections = new List<NeuralConnection>();

        for (int i = 0; i < countNeurons; i++)
        {
            neurons.Add(new Neuron
            {
                Id = Guid.NewGuid(),
                Label = $"Neuron_{i+1}",
                X = randomPit.Next(0, 800),
                Y = randomPit.Next(0, 1000),
                Status = "alive",
                Energy = 100,
                FiringThreshold = 0.5
            });

        }



        foreach (var a in neurons)
        {
            foreach (var b in neurons)
                {
                    if (a.Id == b.Id) continue;

                    var nearNeurons =  
                                Math.Abs(a.X - b.X) < 45 &&
                                Math.Abs(a.Y - b.Y) < 45;     

                    if (nearNeurons && randomPit.NextDouble() < 0.01 )   // 5% de chance de existir a conexão
                    {
                        connections.Add(new NeuralConnection
                        {
                            Id = Guid.NewGuid(),
                            SourceNeuronId = a.Id,
                            TargetNeuronId = b.Id,
                            Weight = randomPit.NextDouble(),         // 0..1 — ver pesquisa de sinapses
                            IsExcitatory = randomPit.NextDouble() < 0.8  // ~80% excitatórias (calibrar)
                        });
                    }
                }
            
        }
        

        _dbContext.Neurons.AddRange(neurons);
        _dbContext.NeuralConnections.AddRange(connections);
        await _dbContext.SaveChangesAsync();

        //LOGS
        Console.WriteLine($"Generated {countNeurons} Neurons");
        Console.WriteLine($"Generated {connections.Count()} Neurons Connections");

        return true; 


    }


}