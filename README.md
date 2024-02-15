# Embloy

An open source application built using the new router, server components and everything new in Next.js 13.

> **Warning**
> This app is a work in progress. I'm building this in public.

## Running Locally

1. Install dependencies using pnpm:

```sh
pnpm install
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Start the development server:

```sh
pnpm dev
```

## Running on Kubernetes

1. Build docker container:

```sh
docker build -t embloy-core-front . && docker tag embloy-front:latest <your-username>/embloy-core-front
```

2. Push to container registry:

```sh
docker push <your-username>/embloy-core-front
```

3. Run image in K8s:

```sh
kubectl apply -f AKS_core_front.yml
```

## License

Licensed under the [MIT license](https://github.com/embloy/embloy-core-server/web/blob/master/LICENSE.md).

---

© Carlo Bortolan, Jan Hummel

> Carlo Bortolan &nbsp;&middot;&nbsp;
> GitHub [@carlobortolan](https://github.com/carlobortolan) &nbsp;&middot;&nbsp;
> contact via [bortolanoffice@embloy.com](mailto:bortolanoffice@embloy.com)
>
> Jan Hummel &nbsp;&middot;&nbsp;
> GitHub [@github4touchdouble](https://github.com/github4touchdouble) &nbsp;&middot;&nbsp;
> contact via [hummeloffice@embloy.com](mailto:hummeloffice@embloy.com)
