using Api.Entities;
using NeuroGraph.Main.Data;
using Microsoft.EntityFrameworkCore;
using Interfaces;

namespace Neurograph.Services;

public class NeuronResetService : INeuronResetService
{

    public AppDbContext _dbContext;
    public NeuronResetService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
        
    }
    
    public async Task<bool> ResetNeurons()
    {

       var neurons = await _dbContext.Neurons.ToListAsync();
       _dbContext.Neurons.RemoveRange(neurons);
       await _dbContext.SaveChangesAsync();

       return true;
        


    }

}
