using Signum.Entities.Files;
using System.IO;

namespace Signum.Engine.Files;

public class FileTypeAlgorithm : FileTypeAlgorithmBase, IFileTypeAlgorithm
{
    public Func<IFilePath, PrefixPair> GetPrefixPair { get; set; }
    public Func<IFilePath, string> CalculateSuffix { get; set; }

    public bool WeakFileReference { get; set; }

    public Func<string, int, string>? RenameAlgorithm { get; set; }

    public FileTypeAlgorithm(Func<IFilePath, PrefixPair> getPrefixPair)
    {
        this.GetPrefixPair = getPrefixPair;
        
        WeakFileReference = false;
        CalculateSuffix = SuffixGenerators.Safe.YearMonth_Guid_Filename;

        //Avoids potentially slow File.Exists, consider using CalculateSuffix using GUID
        RenameAlgorithm = null; // DefaultRenameAlgorithm;
    }

    public static readonly Func<string, int, string> DefaultRenameAlgorithm = (sufix, num) =>
       Path.Combine(Path.GetDirectoryName(sufix)!,
          "{0}({1}){2}".FormatWith(Path.GetFileNameWithoutExtension(sufix), num, Path.GetExtension(sufix)));

    
    public virtual void SaveFile(IFilePath fp)
    {
        using (new EntityCache(EntityCacheType.ForceNew))
        {
            if (WeakFileReference)
                return;

            CalculateSufixWithRenames(fp);

            EnsureDirectory(fp);

            var binaryFile = fp.BinaryFile;
            fp.BinaryFile = null!; //For consistency with async
            SaveFileInDisk(fp.FullPhysicalPath(), binaryFile);
        }
    }

    public virtual Task SaveFileAsync(IFilePath fp, CancellationToken token = default)
    {
        using (new EntityCache(EntityCacheType.ForceNew))
        {
            if (WeakFileReference)
                return Task.CompletedTask;

            CalculateSufixWithRenames(fp);

            EnsureDirectory(fp);

            var binaryFile = fp.BinaryFile;
            fp.BinaryFile = null!; //So the entity is not modified after await
            return SaveFileInDiskAsync(fp.FullPhysicalPath(), binaryFile, token);
        }
    }

    private void CalculateSufixWithRenames(IFilePath fp)
    {
        string suffix = CalculateSuffix(fp);
        if (!suffix.HasText())
            throw new InvalidOperationException("Suffix not set");

        fp.SetPrefixPair(GetPrefixPair(fp));

        int i = 2;
        fp.Suffix = suffix;
        if (RenameAlgorithm != null)
        {
            while (File.Exists(fp.FullPhysicalPath()))
            {
                fp.Suffix = RenameAlgorithm(suffix, i);
                i++;
            }
        }
    }

    static void SaveFileInDisk(string fullPhysicalPath, byte[] binaryFile)
    {
        using (HeavyProfiler.Log("SaveFileInDisk", () => fullPhysicalPath))
        {
            try
            {
                File.WriteAllBytes(fullPhysicalPath, binaryFile);
            }
            catch (IOException ex)
            {
                ex.Data.Add("FullPhysicalPath", fullPhysicalPath);
                ex.Data.Add("CurrentPrincipal", System.Threading.Thread.CurrentPrincipal!.Identity!.Name);

                throw;
            }
        }
    }

    static async Task SaveFileInDiskAsync(string fullPhysicalPath, byte[] binaryFile, CancellationToken token = default)
    {
        using (HeavyProfiler.Log("SaveFileInDiskAsync", () => fullPhysicalPath))
        {
            try
            {
                await File.WriteAllBytesAsync(fullPhysicalPath, binaryFile);
            }
            catch (IOException ex)
            {
                ex.Data.Add("FullPhysicalPath", fullPhysicalPath);
                ex.Data.Add("CurrentPrincipal", System.Threading.Thread.CurrentPrincipal!.Identity!.Name);

                throw;
            }
        }
    }

    private static string EnsureDirectory(IFilePath fp)
    {
        string fullPhysicalPath = fp.FullPhysicalPath();
        string directory = Path.GetDirectoryName(fullPhysicalPath)!;
        if (!Directory.Exists(directory))
            Directory.CreateDirectory(directory);
        return fullPhysicalPath;
    }

    public virtual Stream OpenRead(IFilePath path)
    {
        string fullPhysicalPath = path.FullPhysicalPath();
        using (HeavyProfiler.Log("OpenRead", () => fullPhysicalPath))
            return File.OpenRead(fullPhysicalPath);
    }

    public virtual byte[] ReadAllBytes(IFilePath path)
    {
        string fullPhysicalPath = path.FullPhysicalPath();
        using (HeavyProfiler.Log("ReadAllBytes", () => fullPhysicalPath))
            return File.ReadAllBytes(fullPhysicalPath);
    }

    public virtual void MoveFile(IFilePath ofp, IFilePath fp)
    {
        if (WeakFileReference)
            return;

        string source = ofp.FullPhysicalPath();
        string target = fp.FullPhysicalPath();
        using (HeavyProfiler.Log("ReadAllBytes", () =>
        "SOURCE: " + source + "\n" +
        "TARGET:" + target))
        {
            System.IO.File.Move(source, target);
        }
    }

    public virtual void DeleteFiles(IEnumerable<IFilePath> files)
    {
        if (WeakFileReference)
            return;

        foreach (var f in files)
        {
            string fullPhysicalPath = f.FullPhysicalPath();
            using (HeavyProfiler.Log("DeleteFile", () => fullPhysicalPath))
                File.Delete(fullPhysicalPath);
        }
    }

    public virtual void DeleteFilesIfExist(IEnumerable<IFilePath> files)
    {
        if (WeakFileReference)
            return;

        foreach (var f in files)
        {
            string fullPhysicalPath = f.FullPhysicalPath();

            using (HeavyProfiler.Log("DeleteFileIfExists", () => fullPhysicalPath))
                if (File.Exists(fullPhysicalPath))
                    File.Delete(fullPhysicalPath);
        }
    }

    PrefixPair IFileTypeAlgorithm.GetPrefixPair(IFilePath efp)
    {
        return this.GetPrefixPair(efp);
    }
}

