export function parseServicesFromFlatBody(body: any) {
  const services: { service: string }[] = [];

  Object.keys(body).forEach((key) => {
    const match = key.match(/^services\[(\d+)\]\.service$/);
    if (match) {
      const index = parseInt(match[1], 10);
      services[index] = { service: body[key] };
      delete body[key]; // نحذف المفتاح بعد دمجه في array
    }
  });

  body.services = services;
}