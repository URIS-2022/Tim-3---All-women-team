﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Signum.Utilities;
using Signum.Entities.Exceptions;
using System.Linq.Expressions;
using System.Reflection;

namespace Signum.Entities.Disconnected
{
    [Serializable]
    public class DisconnectedExportDN : IdentifiableEntity
    {
        DateTime creationDate = TimeZoneManager.Now;
        public DateTime CreationDate
        {
            get { return creationDate; }
            set { Set(ref creationDate, value, () => CreationDate); }
        }

        Lite<DisconnectedMachineDN> machine;
        [NotNullValidator]
        public Lite<DisconnectedMachineDN> Machine
        {
            get { return machine; }
            set { Set(ref machine, value, () => Machine); }
        }

        int? @lock;
        [Unit("ms")]
        public int? Lock
        {
            get { return @lock; }
            set { Set(ref @lock, value, () => Lock); }
        }

        int? createDatabase;
        [Unit("ms")]
        public int? CreateDatabase
        {
            get { return createDatabase; }
            set { Set(ref createDatabase, value, () => CreateDatabase); }
        }

        int? createSchema;
        [Unit("ms")]
        public int? CreateSchema
        {
            get { return createSchema; }
            set { Set(ref createSchema, value, () => CreateSchema); }
        }

        int? disableForeignKeys;
        [Unit("ms")]
        public int? DisableForeignKeys
        {
            get { return disableForeignKeys; }
            set { Set(ref disableForeignKeys, value, () => DisableForeignKeys); }
        }

        MList<DisconnectedExportTableDN> copies = new MList<DisconnectedExportTableDN>();
        public MList<DisconnectedExportTableDN> Copies
        {
            get { return copies; }
            set { Set(ref copies, value, () => Copies); }
        }

        int? enableForeignKeys;
        [Unit("ms")]
        public int? EnableForeignKeys
        {
            get { return enableForeignKeys; }
            set { Set(ref enableForeignKeys, value, () => EnableForeignKeys); }
        }

        int? reseedIds;
        [Unit("ms")]
        public int? ReseedIds
        {
            get { return reseedIds; }
            set { Set(ref reseedIds, value, () => ReseedIds); }
        }

        int? backupDatabase;
        [Unit("ms")]
        public int? BackupDatabase
        {
            get { return backupDatabase; }
            set { Set(ref backupDatabase, value, () => BackupDatabase); }
        }

        int? dropDatabase;
        [Unit("ms")]
        public int? DropDatabase
        {
            get { return dropDatabase; }
            set { Set(ref dropDatabase, value, () => DropDatabase); }
        }

        int? total;
        [Unit("ms")]
        public int? Total
        {
            get { return total; }
            set { Set(ref total, value, () => Total); }
        }

        DisconnectedExportState state;
        public DisconnectedExportState State
        {
            get { return state; }
            set { Set(ref state, value, () => State); }
        }

        Lite<ExceptionDN> exception;
        public Lite<ExceptionDN> Exception
        {
            get { return exception; }
            set { Set(ref exception, value, () => Exception); }
        }

        public double Ratio(DisconnectedExportDN estimation)
        {
            double total = (long)estimation.Total.Value;
 
            double result = 0;

            if (!Lock.HasValue)
                return result;
            result += (estimation.Lock.Value) / total;
            
            if (!CreateDatabase.HasValue)
                return result;
            result += (estimation.CreateDatabase.Value) / total;

            if (!CreateSchema.HasValue)
                return result;
            result += (estimation.CreateSchema.Value) / total;

            if (!DisableForeignKeys.HasValue)
                return result;
            result += (estimation.DisableForeignKeys.Value) / total;


            result += Copies.Where(c => c.CopyTable.HasValue).Join(
                estimation.Copies.Where(o => o.CopyTable.HasValue && o.CopyTable.Value > 0),
                c => c.Type, o => o.Type, (c, o) => o.CopyTable.Value / total).Sum();

            if (!Copies.All(a => a.CopyTable.HasValue))
                return result;

            if (!EnableForeignKeys.HasValue)
                return result;
            result += (estimation.EnableForeignKeys.Value) / total;

            if (!ReseedIds.HasValue)
                return result;
            result += (estimation.ReseedIds.Value) / total;

            if (!BackupDatabase.HasValue)
                return result;
            result += (estimation.BackupDatabase.Value) / total;

            if (!DropDatabase.HasValue)
                return result;
            result += (estimation.DropDatabase.Value) / total;

            return result;
        }

        protected override void PreSaving(ref bool graphModified)
        {
            if (Copies != null)
                copies.ForEach((a, i) => a.Order = i);

            base.PreSaving(ref graphModified);
        }

        protected override void PostRetrieving()
        {
            copies.Sort(a => a.Order);
            base.PostRetrieving();
        }

        static Expression<Func<DisconnectedExportDN, int>> CalculateTotalExpression =
            stat =>
                stat.Lock.Value +
                stat.CreateDatabase.Value +
                stat.CreateSchema.Value +
                stat.DisableForeignKeys.Value +
                stat.Copies.Sum(a => a.CopyTable.Value) +
                stat.EnableForeignKeys.Value +
                stat.ReseedIds.Value +
                stat.BackupDatabase.Value +
                stat.DropDatabase.Value;
        public int CalculateTotal()
        {
            return CalculateTotalExpression.Evaluate(this);
        }

        internal DisconnectedExportDN Clone()
        {
            return new DisconnectedExportDN
            {
                Machine = machine,
                Lock = Lock,
                CreateDatabase = CreateDatabase,
                DisableForeignKeys = DisableForeignKeys,
                Copies = Copies.Select(c=>new DisconnectedExportTableDN
                {
                    Type = c.Type,
                    CopyTable = c.CopyTable,
                    MaxIdInRange = c.MaxIdInRange,
                    Errors = c.Errors,
                }).ToMList(),
                EnableForeignKeys = EnableForeignKeys,
                ReseedIds = ReseedIds,
                BackupDatabase = BackupDatabase,
                DropDatabase = DropDatabase,
                Total = Total,
                State = State,
                Exception = Exception
            };
        }
    }

    public enum DisconnectedExportState
    {
        InProgress,
        Completed,
        Error,
    }

    [Serializable]
    public class DisconnectedExportTableDN : EmbeddedEntity
    {
        Lite<TypeDN> type;
        [NotNullValidator]
        public Lite<TypeDN> Type
        {
            get { return type; }
            set { Set(ref type, value, () => Type); }
        }

        int? copyTable;
        [Unit("ms")]
        public int? CopyTable
        {
            get { return copyTable; }
            set { Set(ref copyTable, value, () => CopyTable); }
        }

        int? maxIdInRange;
        public int? MaxIdInRange
        {
            get { return maxIdInRange; }
            set { Set(ref maxIdInRange, value, () => MaxIdInRange); }
        }

        [SqlDbType(Size = int.MaxValue)]
        string errors;
        public string Errors
        {
            get { return errors; }
            set { Set(ref errors, value, () => Errors); }
        }

        int order;
        public int Order
        {
            get { return order; }
            set { Set(ref order, value, () => Order); }
        }
    }
}
