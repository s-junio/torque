type DiskProps = {
  name: string;
};

export function Disk({ name }: DiskProps) {
  return (
    <div>
      💿{name}
      <div
        style={{
          backgroundColor: "red",
          width: "100%",
          height: '12px'
        }}
      ></div>
    </div>
  );
}
