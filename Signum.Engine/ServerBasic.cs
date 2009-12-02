﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Signum.Entities.DynamicQuery;
using Signum.Entities;
using Signum.Engine.DynamicQuery;
using System.Reflection;
using System.ServiceModel;
using Signum.Engine;
using Signum.Engine.Maps;
using Signum.Entities.Basics;
using Signum.Utilities;

namespace Signum.Services
{
    public abstract class ServerBasic : IBaseServer, IQueryServer, INotesServer, IAlertsServer
    {
        protected T Return<T>(MethodBase mi, Func<T> function)
        {
            return Return(mi, mi.Name, function);
        }
        
        protected virtual T Return<T>(MethodBase mi, string description, Func<T> function)
        {
            try
            {
                return function();
            }
            catch (Exception e)
            {
                throw new FaultException(e.Message);
            }
        }

        protected void Execute(MethodBase mi, Action action)
        {
            Return(mi, mi.Name, () => { action(); return true; });
        }

        protected void Execute(MethodBase mi, string description, Action action)
        {
            Return(mi, description, () => { action(); return true; });
        }

        protected abstract DynamicQueryManager GetQueryManager();

        #region IBaseServer
        public IdentifiableEntity Retrieve(Type type, int id)
        {
            return Return(MethodInfo.GetCurrentMethod(), "Retrieve {0}".Formato(type.Name),
             () => Database.Retrieve(type, id));
        }

        public IdentifiableEntity Save(IdentifiableEntity entidad)
        {
            return Return(MethodInfo.GetCurrentMethod(), "Save {0}".Formato(entidad.GetType()),
             () => { Database.Save(entidad); return entidad; });
        }

        public List<Lite> RetrieveAllLite(Type liteType, Type[] types)
        {
            return Return(MethodInfo.GetCurrentMethod(), "RetrieveAllLite {0}".Formato(liteType),
             () => AutoCompleteUtils.RetriveAllLite(liteType, types));
        }

        public List<Lite> FindLiteLike(Type liteType, Type[] types, string subString, int count)
        {
            return Return(MethodInfo.GetCurrentMethod(), "FindLiteLike {0}".Formato(liteType),
             () => AutoCompleteUtils.FindLiteLike(liteType, types, subString, count));
        }

        public Type[] FindImplementations(Type liteType, MemberInfo[] members)
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => Schema.Current.FindImplementations(liteType, members));
        }

        public List<IdentifiableEntity> RetrieveAll(Type type)
        {
            return Return(MethodInfo.GetCurrentMethod(), "RetrieveAll {0}".Formato(type),
            () => Database.RetrieveAll(type));
        }

        public List<IdentifiableEntity> SaveList(List<IdentifiableEntity> list)
        {
            Execute(MethodInfo.GetCurrentMethod(),
            () => Database.SaveList(list));
            return list;
        }

        public Dictionary<Type, TypeDN> ServerTypes()
        {
            return Return(MethodInfo.GetCurrentMethod(),
                () => TypeLogic.TypeToDN);
        }

        public DateTime ServerNow()
        {
            return Return(MethodInfo.GetCurrentMethod(),
                () => DateTime.Now);
        }

        public List<Lite<TypeDN>> TypesAssignableFrom(Type type)
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => TypeLogic.TypesAssignableFrom(type));
        }
        #endregion

        #region IQueryServer
        public QueryDescription GetQueryDescription(object queryName)
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => GetQueryManager().QueryDescription(queryName));
        }

        public QueryResult GetQueryResult(object queryName, List<Filter> filters, int? limit)
        {
            return Return(MethodInfo.GetCurrentMethod(), "GetQueryResult {0}".Formato(queryName),
             () => GetQueryManager().ExecuteQuery(queryName, filters, limit));
        }

        public int GetQueryCount(object queryName, List<Filter> filters)
        {
            return Return(MethodInfo.GetCurrentMethod(), "GetQueryCount {0}".Formato(queryName),
          () => GetQueryManager().ExecuteQueryCount(queryName, filters));
        }

        public List<object> GetQueryNames()
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => GetQueryManager().GetQueryNames());
        }
        #endregion

        #region INotesServer Members
        public virtual List<Lite<INoteDN>> RetrieveNotes(Lite<IdentifiableEntity> lite)
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => (from n in Database.Query<NoteDN>()
                    where n.Entity == lite
                    select n.ToLite<INoteDN>()).ToList());
        }
        #endregion

        #region IAlertsServer Members

        public virtual List<Lite<IAlertDN>> RetrieveAlerts(Lite<IdentifiableEntity> lite)
        {
            return Return(MethodInfo.GetCurrentMethod(),
             () => (from n in Database.Query<AlertDN>()
                    where n.Entity == lite
                    select n.ToLite<IAlertDN>()).ToList());
        }

        public virtual IAlertDN CheckAlert(IAlertDN alert)
        {
            return Return(MethodInfo.GetCurrentMethod(), () =>
                {
                    AlertDN a = (AlertDN)alert;
                    a.CheckDate = DateTime.Now;
                    return Database.Save((AlertDN)alert);
                });
        }

        public CountAlerts CountAlerts(Lite<IdentifiableEntity> lite)
        {
            return Return(MethodInfo.GetCurrentMethod(), () =>
                new CountAlerts() 
                {
                    CheckedAlerts = Database.Query<AlertDN>().Count(a => a.CheckDate.HasValue),
                    WarnedAlerts = Database.Query<AlertDN>().Count(a => a.AlertDate.HasValue && a.AlertDate <= DateTime.Now),
                    FutureAlerts = Database.Query<AlertDN>().Count(a => (!a.AlertDate.HasValue || a.AlertDate > DateTime.Now) && !a.CheckDate.HasValue), 
                });
        }

        #endregion
    }
}
