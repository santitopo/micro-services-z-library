using Microsoft.EntityFrameworkCore;
using PersistenceInterface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Persistence
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private DbSet<T> DbSet;
        private DbContext context;
        public Repository(DbContext context)
        {
            this.DbSet = context.Set<T>();
            this.context = context;
        }
        public void Create(T entity)
        {
            DbSet.Add(entity);
        }

        public void Delete(T entity)
        {
            DbSet.Remove(entity);
        }

        public T Get(int id)
        {
            return DbSet.Find(id);
        }

        public IEnumerable<T> GetAll(string[] includes)
        {
            if (includes.Length > 0)
            {
                var query = context.Set<T>().AsQueryable();

                foreach (string include in includes)
                    query = query.Include(include);

                return query;
            }
            else
            {
                return DbSet.ToList();
            }
        }

        public void Save()
        {
            context.SaveChanges();
        }

        public void Update(T entity)
        {
            DbSet.Update(entity);
        }
    }
}
