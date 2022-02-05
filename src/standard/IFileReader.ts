export interface IFileReader {
	read(path: string): Promise<string>
}
