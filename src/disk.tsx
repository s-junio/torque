type DiskProps = {
  name: string;
  totalSpace: number;
  availableSpace: number;
};

export function Disk({ name, availableSpace, totalSpace, }: DiskProps) {

  const usedSpace = totalSpace - availableSpace;
  return (
    <div style={{ display: 'flex' }}>
      <span style={{ fontSize: '2.5rem' }}>
        💿
      </span>
      <div style={{ flex: 1 }}>

        {name}
        <div style={{
          padding: '1px',
          backgroundColor: 'white',
          borderRadius: "4px"
        }}>
          <div
            style={{
              backgroundColor: "#bb3cf1",
              width: `${usedSpace / totalSpace * 100}%`,
              height: '18px',
              borderRadius: "4px"
            }}
          ></div>
        </div>
        <span>{totalSpace}</span> |
        <span>{availableSpace}</span>
      </div>
    </div>
  );
}
