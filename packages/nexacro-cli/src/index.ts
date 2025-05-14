/*import
{
    createMessageConnection,
    MessageReader,
    MessageWriter,
    RequestType,
    NotificationType
} from 'vscode-jsonrpc';*/
// 최신 버전 문법 이 바꼈나비네

/*const reader = new MessageReader(process.stdin);
const writer = new MessageWriter(process.stdout);

const connection = createMessageConnection(reader, writer);

const PingRequest = new RequestType<void, string, void>('ping');
const NotifyEvent = new NotificationType<string>('event');

connection.onRequest(PingRequest, () => 
{
    return 'pong';
});

connection.onNotification(NotifyEvent, (message) => 
{
    console.log('Notification received:', message);
});

connection.listen();*/

export const nexacroCli = {
    cli(input: string) 
    {
        // 향후 실제 파싱 로직으로 대체 예정
        return {
            type: "stub",
            input,
            result: "cli content (stub)"
        };
    }
};