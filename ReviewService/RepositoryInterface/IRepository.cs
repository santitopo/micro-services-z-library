using System;
using System.Collections.Generic;
using System.Text;

namespace PersistenceInterface
{
    public interface IRepository<T> where T : class
    {
        void Create(T entity);
        void Delete(T entity);
        void Update(T entity);
        T Get(int id);
        IEnumerable<T> GetAll(string[] includes);
        void Save();
    }
}
