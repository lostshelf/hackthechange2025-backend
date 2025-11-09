{
  description = "Environment I'm (Hadi) gonna use to run this project";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          shell = pkgs.fish;
          packages = with pkgs; [
            nodejs_24
            pnpm
            fish 
            git
            gcc
            gnumake
            zlib
            pkg-config
	    nodePackages.tailwindcss
          ];
          
          shellHook = ''
            export PATH="$PWD/node_modules/.bin:$PATH"
            exec ${pkgs.fish}/bin/fish -i
          '';
        };
      }
    );
}
